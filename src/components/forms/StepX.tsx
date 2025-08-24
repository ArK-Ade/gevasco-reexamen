// components/InputField.tsx
type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({ label, name, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
      />
    </div>
  );
}
