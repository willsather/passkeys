export default function Header() {
  return (
    <header>
      <div className="flex justify-end items-center m-6 gap-6">
        <a href="/">
          <button>
            <p>Home</p>
          </button>
        </a>

        <a href="/account">
          <button>
            <p>Account</p>
          </button>
        </a>
      </div>
    </header>
  );
}
