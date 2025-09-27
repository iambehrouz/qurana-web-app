import axios from "../../helpers/axios";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {


  return {
    pageContext: {
      data: {
        user: pageContext.data.user,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId
      },
    },
  };
};
