import { useState } from 'react';

export function useProjectPlanAI() {
  const [loading, setLoading] = useState(false);

  const generatePlan = async (description) => {
    setLoading(true);
    // Stub: Replace with actual AI call
    const fakePlan = [{ title: "Define Scope", tasks: ["List goals", "Clarify deliverables"] }];
    setLoading(false);
    return fakePlan;
  };

  return { generatePlan, loading };
}
