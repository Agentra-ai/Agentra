import { getEmbeddings } from "@/hooks/api-action/embedding";
import { getMatchesFromEmbeddings } from "@/hooks/api-action/get-match-embedding";

export async function getContextAction(
  query: string,
  fileKeys: { fileKey: string; isActive: boolean }[],
  topKvalue?: number
) {
  const queryEmbeddings = await getEmbeddings(query)

  // console.log("queryEmbeddings", fileKeys, topKvalue, query)
  const matches = await getMatchesFromEmbeddings(
    queryEmbeddings,
    fileKeys,
    topKvalue
  )
  // console.log("matches", matches)



  interface Match {
    id: string;
    score: number;
    values: any[];
    sparseValues?: any;
    metadata: {
      file_key: string;
      isActive: boolean;
      pageNumber: number;
      text: string;
    };
  }

  const sortedResult = matches.sort((a, b) => {
    return (b.score ?? 0) - (a.score ?? 0);
  });

  // console.log("quelified", matches)

// type MatchResponse = {
//     id: string;
//     score: number;
//     values: any[];
//     sparseValues?: any;
//     metadata: {
//         file_key: string;
//         isActive: boolean;
//         pageNumber: number;
//         text: string;
//     };
// };

//@ts-ignore
// const matchResponses: MatchResponse[] = matches;

  type Metadata = {
    text: string
    pageNumber: number
  }
  

  return sortedResult
}
