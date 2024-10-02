use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

fn is_prime(num: u32) -> bool {
  let upper_limit = (num as f32).sqrt() as usize;
  for divisor in 2..=upper_limit {
    if num % (divisor as u32) == 0 { return false }
  };
  true
}

#[wasm_bindgen]
pub fn calc_next_prime(prev: u32) -> u32 {
  let mut next_prime = prev + 1;
  while !is_prime(next_prime) {
    next_prime += 1;
  };
  next_prime
}
