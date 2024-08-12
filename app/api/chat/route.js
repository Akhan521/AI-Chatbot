import { NextResponse } from "next/server";
import OpenAI from "openai";
import { firestore } from "../firebase/firebase"; // Adjust the import path as needed
import { doc, getDoc, setDoc } from "firebase/firestore";

const systemPrompt =
  "Act as the requested character. Only respond in character. If no character is set, ask the user to set one. To set a character, respond with: SET [character details] | [response in character style].";

export async function POST(req) {
  try {
    const openai = new OpenAI();
    const { user, messages } = await req.json();

    console.log("Received request:", { user, messages });

    // Fetch the user's character from Firestore
    const userDocRef = doc(firestore, "users", user.uid);
    let character;
    try {
      const userDoc = await getDoc(userDocRef);
      character = userDoc.exists() ? userDoc.data().character : null;
      console.log("Fetched character:", character);
    } catch (firestoreError) {
      console.error("Error fetching from Firestore:", firestoreError);
      return new NextResponse(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }

    // Prepare messages for OpenAI, including the character if set
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...(character
        ? [{ role: "system", content: `Current character: ${character}` }]
        : []),
      ...messages.slice(messages.length < 15 ? 0 : messages.length - 15, -1),
    ];

    console.log("Prepared AI messages:", aiMessages);

    let completion;
    try {
      completion = await openai.chat.completions.create({
        messages: aiMessages,
        model: "gpt-4o-mini", // Make sure this is the correct model name
      });
    } catch (openaiError) {
      console.error("Error creating OpenAI chat completion:", openaiError);
      return new NextResponse(JSON.stringify({ error: "AI service error" }), {
        status: 500,
      });
    }

    let aiResponse = completion.choices[0]["message"]["content"];
    console.log(aiResponse);

    if (aiResponse.startsWith("SET")) {
      let barIndex = aiResponse.indexOf("|");
      let newCharacterName = aiResponse.substring(3, barIndex);
      aiResponse = aiResponse.substring(barIndex + 1);

      try {
        // Update the character in Firestore
        await setDoc(
          userDocRef,
          { character: newCharacterName },
          { merge: true }
        );
        console.log("Updated character in Firestore:", newCharacterName);
      } catch (updateError) {
        console.error("Error updating character in Firestore:", updateError);
      }
    }

    return new NextResponse(aiResponse);
  } catch (error) {
    console.error("Unexpected error in POST handler:", error);
    return new NextResponse(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500 }
    );
  }
}
