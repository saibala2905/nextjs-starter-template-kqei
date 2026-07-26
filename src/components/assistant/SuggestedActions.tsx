"use client";

interface Props {

  onAction: (
    prompt: string
  ) => void;

}

const actions = [

  "Summarize Investigation",

  "Expand Network",

  "Generate Report",

  "Open Crime Analytics",

];

export default function SuggestedActions({

  onAction,

}: Props) {

  return (

    <div className="border-t bg-white p-4">

      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">

        Suggested Actions

      </p>

      <div className="flex flex-wrap gap-2">

        {actions.map((action) => (

          <button
            key={action}
            onClick={() =>
              onAction(action)
            }
            className="rounded-full border bg-slate-50 px-3 py-2 text-xs transition hover:bg-blue-50"
          >

            {action}

          </button>

        ))}

      </div>

    </div>

  );

}