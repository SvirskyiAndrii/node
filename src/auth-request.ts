// @ts-nocheck

import axios from "axios";
const base = (method, url, data, other = {}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const { headers = {}, options = {} } = other;
    const token = // MOCK TOKEN - give your user token to see file uploaded into your account
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTQ3NjkxODYsImV4cCI6MTcyNjM5MTU4Niwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoibmFzdHlhYmFyYWJha2giLCJ1c2VyX3Nlc3Npb25fdXVpZCI6ImExNmRkYTk0LWM2ZTEtNGI1Ny1iNTMyLTNkZjk2NmJlNThmOCIsIndvcmtzcGFjZV9pZCI6OTE4fQ.ZevIrA0cI_jmR-DcbWcij649WmAWEitIkAKCV_KSCVcB9wFKptzQsJ7LFW-dPziHB5S-mHq4Ni_spZF5a_fwQhCEg9zU3IHeeTOQqglopU8zLeqcZySPhMpG_cZjZfKGFof0eDuMX8nrBV0hLoyz5K744aAp26jZG77b9ogRliyypT-od7sJbLX0LI9cutcffK6UlQkqQo5FPXfglMWw5Lo_wXJ7EXUqOG0XtHT1F1nva0fYVFxt6htRB_saEKuJpS7jd589z4vlXhWm2AprU5KGrbyKx99g_FBfCYCe52UOPrAbj9eb8fE-hDLYP5pPfZYXo0VpnYTubRBJj8Q0IBHgaoVYPKNv5Rtpk3XUxzvfb_FwVOATP1qffIkm6AU_q2qfkNCTkhCCrkBCCxBTHVIhaaSU0goHDzfgrICtvZAOEPl2JdaEH1bsk3L5TLckHHrZa7boy2Tx9o181hfxl-XKQ7ztbWf8ntE3jGSzueTaB_IJsADkFHgyz_M8-mixzD9OFuHJsjl265VnnF4W7x3tpzXPchMydYiJSUCvp6UlpZyMW3UC76iCnL2qFg4i-2dasgFOWUzdRHPnY5wbTwhQ0-T5P4JbwTJm-PcCTqlJhePCs24kfstBL8fU2-4KsUucNtqlo7PoySAu8fDOqPYc9oJNHfTbsmphjnqWeD4";
    const requestConfig = {
      method,
      data,
      url,
      headers: {
        "X-Token": token,
        Accept: "application/json, text/plain, */*",
        ...headers,
      },
      ...options,
    };
    if (!token) delete requestConfig.headers["X-Token"];

    try {
      const response = await axios(requestConfig);
      resolve(response);
    } catch (error) {
      //   if (error?.response?.status === 401) {
      //     authTokenRefresh()
      //       .then(() => {
      //         window.location.reload();
      //       })
      //       .catch(() => {
      //         removeToken();
      //         window.location.reload();
      //       });
      //   }
      //   if (error?.response?.status === 403 || error?.response?.status === 412) {
      //     const me = store.getState().account.userInfo.entities;
      //     if (
      //       !(
      //         me.is_password_access &&
      //         me.password_access &&
      //         !me.password_access?.enabled
      //       )
      //     ) {
      //       store.dispatch(
      //         setErrors(error?.response?.data, error?.response?.status)
      //       );
      //     }
      //   }
      //   reject(error);
    }
  });

const authRequest = {};
["get", "post", "put", "delete", "patch"].forEach((method) => {
  authRequest[method] = (...props) => base(method.toUpperCase(), ...props);
});
export default authRequest;
