import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DWio_lQ0.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/admin/changepassward.astro.mjs');
const _page2 = () => import('./pages/api/admin/deleteappointment.astro.mjs');
const _page3 = () => import('./pages/api/admin/fetchdata.astro.mjs');
const _page4 = () => import('./pages/api/admin/_id_.astro.mjs');
const _page5 = () => import('./pages/api/alldoctordetails.astro.mjs');
const _page6 = () => import('./pages/api/createprofile.astro.mjs');
const _page7 = () => import('./pages/api/doctor/alldocumentofuser.astro.mjs');
const _page8 = () => import('./pages/api/doctor/billingsetting.astro.mjs');
const _page9 = () => import('./pages/api/doctor/cancelappointment.astro.mjs');
const _page10 = () => import('./pages/api/doctor/changepassword.astro.mjs');
const _page11 = () => import('./pages/api/doctor/createprescription.astro.mjs');
const _page12 = () => import('./pages/api/doctor/fetchdocumentfromuser.astro.mjs');
const _page13 = () => import('./pages/api/doctor/practice-settings.astro.mjs');
const _page14 = () => import('./pages/api/doctor/upload.astro.mjs');
const _page15 = () => import('./pages/api/doctor/uploadfromreport.astro.mjs');
const _page16 = () => import('./pages/api/doctor/_id_.astro.mjs');
const _page17 = () => import('./pages/api/doctorprofilecreate.astro.mjs');
const _page18 = () => import('./pages/api/download.astro.mjs');
const _page19 = () => import('./pages/api/getid.astro.mjs');
const _page20 = () => import('./pages/api/login.astro.mjs');
const _page21 = () => import('./pages/api/loginadmin.astro.mjs');
const _page22 = () => import('./pages/api/register.astro.mjs');
const _page23 = () => import('./pages/api/registeradmin.astro.mjs');
const _page24 = () => import('./pages/api/user/billingsetting.astro.mjs');
const _page25 = () => import('./pages/api/user/bookappointment.astro.mjs');
const _page26 = () => import('./pages/api/user/changepassword.astro.mjs');
const _page27 = () => import('./pages/api/user/deleteappointment.astro.mjs');
const _page28 = () => import('./pages/api/user/fetchdocumentfromappointment.astro.mjs');
const _page29 = () => import('./pages/api/user/fetchfile.astro.mjs');
const _page30 = () => import('./pages/api/user/healthrecords.astro.mjs');
const _page31 = () => import('./pages/api/user/reschedulingappointment.astro.mjs');
const _page32 = () => import('./pages/api/user/setprimaryasbilling.astro.mjs');
const _page33 = () => import('./pages/api/user/upload.astro.mjs');
const _page34 = () => import('./pages/api/user/uploadfromreport.astro.mjs');
const _page35 = () => import('./pages/api/user/_id_.astro.mjs');
const _page36 = () => import('./pages/_---index_.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.16.9_@netlify+blobs_f827bf51d746b639007b04efa67bd013/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/admin/changePassward.ts", _page1],
    ["src/pages/api/admin/deleteAppointment.ts", _page2],
    ["src/pages/api/admin/fetchdata.ts", _page3],
    ["src/pages/api/admin/[id].ts", _page4],
    ["src/pages/api/allDoctorDetails.ts", _page5],
    ["src/pages/api/createProfile.ts", _page6],
    ["src/pages/api/doctor/alldocumentofuser.ts", _page7],
    ["src/pages/api/doctor/billingSetting.ts", _page8],
    ["src/pages/api/doctor/cancelAppointment.ts", _page9],
    ["src/pages/api/doctor/changePassword.ts", _page10],
    ["src/pages/api/doctor/createPrescription.ts", _page11],
    ["src/pages/api/doctor/fetchdocumentfromuser.ts", _page12],
    ["src/pages/api/doctor/practice-settings.ts", _page13],
    ["src/pages/api/doctor/upload.ts", _page14],
    ["src/pages/api/doctor/uploadfromReport.ts", _page15],
    ["src/pages/api/doctor/[id].ts", _page16],
    ["src/pages/api/doctorProfileCreate.ts", _page17],
    ["src/pages/api/download.ts", _page18],
    ["src/pages/api/getId.ts", _page19],
    ["src/pages/api/login.ts", _page20],
    ["src/pages/api/loginAdmin.ts", _page21],
    ["src/pages/api/register.ts", _page22],
    ["src/pages/api/registerAdmin.ts", _page23],
    ["src/pages/api/user/billingSetting.ts", _page24],
    ["src/pages/api/user/bookAppointment.ts", _page25],
    ["src/pages/api/user/changePassword.ts", _page26],
    ["src/pages/api/user/deleteAppointment.ts", _page27],
    ["src/pages/api/user/fetchdocumentfromappointment.ts", _page28],
    ["src/pages/api/user/fetchFile.ts", _page29],
    ["src/pages/api/user/healthrecords.ts", _page30],
    ["src/pages/api/user/reschedulingAppointment.ts", _page31],
    ["src/pages/api/user/setPrimaryAsBilling.ts", _page32],
    ["src/pages/api/user/upload.ts", _page33],
    ["src/pages/api/user/uploadfromReport.ts", _page34],
    ["src/pages/api/user/[id].ts", _page35],
    ["src/pages/[...index].astro", _page36]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "82effcf6-d1de-4b27-8f41-bbd3734f607b"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
