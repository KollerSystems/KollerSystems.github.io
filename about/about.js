import init, { calc_next_prime } from "../wasm/pkg/wasm_lib.js";
init().then(() => {
  let p = 2;
  while (p < 100000) {
    console.log(p);
    p = calc_next_prime(p);
  }
});
