"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  id: string;
  type: "post" | "qna";
}

export default function ViewTracker({ id, type }: ViewTrackerProps) {
  useEffect(() => {
    const viewedCookieName = `viewed_${type}_${id}`;
    // Determine if this item has already been viewed by checking the cookie in the browser
    const hasViewed = typeof document !== 'undefined'
      && document.cookie.split('; ').some((c) => c.startsWith(`${viewedCookieName}=`));
    console.log(`[ViewTracker] Initial hasViewed for ${type}_${id}:`, hasViewed);

    if (!hasViewed) {
      console.log(`[ViewTracker] Cookie not found, attempting to set cookie and increment view.`);
      // Call the API Route to set the cookie
      fetch("/api/set-viewed-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type }),
        credentials: 'include',
      })
        .then((res) => {
          return res.json();
        })
        .then(async (data) => {
          if (data.success) {
            if (type === "post") {
              const { incrementPostViewAction } = await import("../app/board/[id]/actions");
              await incrementPostViewAction(id);
            } else if (type === "qna") {
              const { incrementQnaViewAction } = await import("../app/qna/[id]/actions");
              await incrementQnaViewAction(id);
            }
          } else {
            console.error(`[ViewTracker] set-viewed-cookie data.success is false:`, data);
          }
        })
        .catch((error) => {
          console.error("Failed to set viewed cookie or increment view:", error);
        });
    }
  }, [id, type]);

  return null; // This component doesn't render anything visible
}
