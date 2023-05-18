const { makeRpcCustomRequest } = require("./lib");

async function main() {
  const request = await makeRpcCustomRequest(
    "https://api.espanicon.team/api/v3",
    "cx9f4ab72f854d3ccdc59aa6f2c3e2215dd62e879f",
    "get_period_status",
    {}
  );
  console.log(request);
}

main();
