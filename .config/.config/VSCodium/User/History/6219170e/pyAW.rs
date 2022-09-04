use std::io;

fn main() {
    let num = 10;

    println!("Guess the number");

    println!("Input guess: ");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed {guess}");

    
}
