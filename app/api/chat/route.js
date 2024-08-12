import { NextResponse } from "next/server"; // Import NextResponse from Next.js for handling responses
import OpenAI from "openai"; // Import OpenAI library for interacting with the OpenAI API
import { AuthContext } from "../../contexts/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { useContext } from "react";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt =
  "Act as the requested character. Only respond in character. If no character is set, ask the user to set one. To set a character, respond with: SET [character details]: [response in character style]."; // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const { user, messages } = await req.json(); // Extract user and messages from the request body


  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt + "Character: " + user.character + " Input: ",
      },
      ...messages,
    ], // Include the system prompt and user messages
    model: "gpt-4o", // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      let characterDetail = ""; // Initialize a variable to hold character details temporarily
      let setDetected = false; // Flag to indicate whether "SET" was detected


      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            if (setDetected) {
              // If "SET" was previously detected, check for "|"
              
              if (content.includes("|")) {
                // Grab the stuff between "SET" and "|"
                const endIndex = content.indexOf("|");
                characterDetail += content.slice(0, endIndex).trim(); // Append to character detail
                console.log("Setting new character:", characterDetail);

                // Update Firebase database
                if (user) {
                  const userRef = doc(db, "users", user.id); // Reference to the user's document
                  await updateDoc(userRef, { character: characterDetail }); // Update character value
                }
                setDetected = false; // Reset the flag after processing
              } else {
                // If "|" not found, keep appending to characterDetail
                characterDetail += content; // Keep collecting content until "|"
              }
            } if (content.startsWith("SET")) {
              // If it starts with "SET", set the flag and initialize characterDetail
              setDetected = true;
              const setIndex = content.indexOf("SET") + 3; // Move the index past "SET"
              characterDetail += content.slice(setIndex).trim(); // Start collecting character details
            } else {
              // Carry on with normal processing for non-SET content
              const text = encoder.encode(content);
              controller.enqueue(text); // Enqueue the remaining content to the stream
            }
          }
        }
        try {
          for await (const chunk of completion) {
            console.log("Received chunk:", chunk); // Log each chunk received
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              console.log("Processing content:", content); // Log content being processed
              // Additional logic...
            }
          }
        } catch (err) {
          console.error("Error processing stream:", err); // Log detailed error if something goes wrong
        }

      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } 
      

      finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  console.log(stream);

  return new NextResponse(stream); // Return the stream as the response
}