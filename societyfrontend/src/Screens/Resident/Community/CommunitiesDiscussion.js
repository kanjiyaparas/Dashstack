// export default function CommunitiesDiscussion() {
//   return <>
//     CommunitiesDiscussion
//   </>
// }

import React, { useState } from "react";
import CommunityChatSidebar from "../Community/ommunityChatSidebar.js";
import CommunityChatHeader from "../Community/CommunityChatHeader.js";
import CommunityChatData from "../Community/CommunityChatData.js";

const CommunitiesDiscussion = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="grid grid-cols-12 p-[30px] gap-[1px] bg-[#F0F5FB] h-screen">
      <div className="col-span-3">
        <CommunityChatSidebar onSelectMember={setSelectedMember} />
      </div>
      <div className="col-span-9 flex flex-col">
        <CommunityChatHeader selectedMember={selectedMember} />
        <div className="p-5 bg-[#F4F4F4] h-full">
          <CommunityChatData selectedMember={selectedMember} />
        </div>
      </div>
    </div>
  );
};

export default CommunitiesDiscussion;
