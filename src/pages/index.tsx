import { Button, Center, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <main className="p-[16px] h-full flex flex-col">
      {/* TITLE */}
      <h2 className="text-[24px]">Design and Construction of Structural Concrete 2</h2>
      <Divider className="my-[16px]" />

      {/* CONTENT */}
      <Center className="flex-grow">
        <Button onClick={() => router.push("/beam")} colorScheme="blue">
          Beam or Slab Design Sheet
        </Button>
      </Center>
    </main>
  );
}
