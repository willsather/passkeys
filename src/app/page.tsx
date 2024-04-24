import LoginContainer from "@/src/app/(login)/LoginContainer";

export default function HomePage() {
  return (
    <div className="bg-secondary">
      <div className="flex justify-center mt-10">
        <h1>Passkey Demo</h1>
      </div>

      <div className="flex justify-center my-8">
        <h2>quick demo to create passkeys</h2>
      </div>

      <LoginContainer />
    </div>
  );
}
