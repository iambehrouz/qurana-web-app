import axios from "../../helpers/axios";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {


  return {
    pageContext: {
      data: {
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId
      },
    },
  };
};
