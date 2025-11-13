import React, { useState } from "react";
import OcrBox from "../components/OcrBox";

export default function EntryPage() {
  const [ocrData, setOcrData] = useState(null);

  return (
    <div>
      <h1>Entry Page</h1>
      <OcrBox onDetected={(data) => setOcrData(data)} />
      {ocrData && (
        <div style={{ marginTop: "25px" }}>
          <pre>{JSON.stringify(ocrData.raw, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
