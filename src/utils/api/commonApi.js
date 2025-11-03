import { __postApiData } from "./index"

const __getCommenApiDataList = async ({
  lookup_type,
  parent_lookup_id,
  isShort,
}) => {
  return __postApiData(`/api/v1/common/lookuplist`, {
    // lookupcodes: lookup_type.join(","),
    lookup_type: lookup_type.join(","),
    parent_lookup_id: parent_lookup_id || null,
  })
    .then((res) => {
      // console.log(res, "res common/lookuplist.on common API")
      if (res.response.response_code == "200") {
        const list = res.data.map((item) => ({
          id: item._id,
          name: item?.lookup_value,
          ...item,
        }));
        return list;
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}

export { __getCommenApiDataList }
