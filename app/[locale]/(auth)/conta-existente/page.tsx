import { ExistingAccountForm } from "@/components/existing-account-form";
import { Suspense } from "react";

export default function ExistingAccountPage() {
  return (
    <div className="flex flex-1 justify-center items-center bg-muted">
      <Suspense>
        <ExistingAccountForm />
      </Suspense>
    </div>
  );
}
