type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition">
      {text}
    </button>
  );
}