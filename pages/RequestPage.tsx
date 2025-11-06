import React from 'react';

const RequestPage: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Request Episode</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold text-richblack">
            Suggest a podcast episode for decoding
          </h1>
          <p className="mt-4 text-gray-600">
            Tell us which episode you want summarized and we’ll add it to the queue. The request
            form will be wired up in the next task.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-primary/40 bg-white px-6 py-10 text-center text-gray-500">
          <p className="font-medium">
            Request form coming soon. You’ll be able to submit episodes and view community votes here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RequestPage;
