export type Request = {
  request: { formData: () => Promise<FormData> };
};

export type Values = {
  title: string | null;
  slug: string | null;
  markdown: string | null;
};

export type ActionData =
  | {
      values: Values;
      errors: Values;
    }
  | undefined;

export function formStringValue(data: FormData, key: string): string | null {
  const value = data.get(key);
  return value ? value.toString() : null;
}

type InputProps = {
  error?: string | null;
  defaultValue?: string | null;
  name: string;
};

export function LabelledInput({ error, defaultValue, name }: InputProps) {
  return (
    <label>
      <span className="capitalize">{name}</span>
      {error ? <em className="text-red-600">{error}</em> : null}
      <input
        type="text"
        name={name}
        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        defaultValue={defaultValue || undefined}
      />
    </label>
  );
}

export function LabelledTextArea({ error, defaultValue, name }: InputProps) {
  return (
    <>
      <label className="capitalize" htmlFor={name}>
        {name}
      </label>
      {error ? <em className="text-red-600">{error}</em> : null}
      <br />
      <textarea
        rows={20}
        id={name}
        name={name}
        className="w-full rounded border border-gray-500 px-2 py-1 font-mono text-lg"
        defaultValue={defaultValue || undefined}
      />
    </>
  );
}

export function SubmitButton({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
    >
      {text}
    </button>
  );
}
