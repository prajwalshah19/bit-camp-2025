import asyncio

from pydantic import BaseModel

from ollama import AsyncClient

from os import getcwd


def prompt(topics, text):
  with open(getcwd() + '/server/app/engine/prompt.txt', 'r') as file:
    data = file.read()
    data = data.replace("TOPIC", topics).replace("DOCUMENT_TEXT", text)
    return data



class Information(BaseModel):
  text: str

class Response(BaseModel):
  score: int
  interesting: list[Information]
# Define the schema for the response


class ResponseList(BaseModel):
  friends: list[Response]


topics = 'weapons, national security, cyber warfare, peanuts, motor vehicles'
text_in = "jimmy has a big racecar which he lets tommy drive. "
text_in2 = "Tommy is very good at using computers to threaten his friends"
alt = 'I have two friends. The first is Ollama 22 years old busy saving the world, and the second is Alonso 23 years old and wants to hang out. Return a list of friends in JSON format'

async def main():
  client = AsyncClient()
  response = await client.chat(
    model='llama3.2',
    messages=[{'role': 'user', 'content': prompt(topics=topics, text=text_in)}],
    # format=FriendList.model_json_schema(),  # Use Pydantic to generate the schema
    options={'temperature': 0},  # Make responses more deterministic
  )

  # Use Pydantic to validate the response
#   friends_response = FriendList.model_validate_json(response.message.content)
  print(response.message.content)


if __name__ == '__main__':
  asyncio.run(main())