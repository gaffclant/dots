use std::io;
use rand::Rng

fn main() {
    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("Guess the number");

    println!("Input guess: ");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed {guess}");

    
}
