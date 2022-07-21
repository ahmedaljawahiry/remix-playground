import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

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

function useDefaultValue(defaultValue: string | undefined | null) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return {
    value: value || undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
  };
}

export function LabelledInput({ error, defaultValue, name }: InputProps) {
  // https://remix.run/docs/en/v1/guides/data-loading#search-params-and-controlled-inputs
  const { value, onChange } = useDefaultValue(defaultValue);

  return (
    <label>
      <span className="capitalize">{name}</span>
      {error ? <em className="text-red-600">{error}</em> : null}
      <input
        type="text"
        name={name}
        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        onChange={onChange}
        value={value}
      />
    </label>
  );
}

export function LabelledTextArea({ error, defaultValue, name }: InputProps) {
  const { value, onChange } = useDefaultValue(defaultValue);

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
        onChange={onChange}
        value={value || undefined}
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
