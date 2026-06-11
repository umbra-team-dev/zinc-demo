declare module "process/browser" {
  const processShim: NodeJS.Process;
  export default processShim;
}
