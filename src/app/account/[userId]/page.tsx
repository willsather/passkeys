import { UserRepository } from "@/lib/db/users";
import { PasskeyRepository } from "@/lib/db/passkeys";

export default async function AccountPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const user = await UserRepository.findUserById(userId);
  const passkeys = await PasskeyRepository.findPasskeysByUserId(userId);

  if (user == null) {
    return (
      <div>
        <h1>Hmm, something went wrong</h1>
        <p>We can&apos;t find that user!</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {user.username}</h1>
      <p>{userId}</p>

      <h3>Passkeys</h3>
      {passkeys.map((passkey) => (
        <p key={passkey.id}>{passkey.id}</p>
      ))}
    </div>
  );
}
