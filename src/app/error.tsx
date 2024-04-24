"use client";

import { useEffect } from "react";

const Error = ({ error }: { error: Error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-secondary">
      <div className="flex justify-center mt-8 mx-4">
        <h3 className="text-center">ugh, we had an error :(</h3>
      </div>
    </div>
  );
};

export default Error;
