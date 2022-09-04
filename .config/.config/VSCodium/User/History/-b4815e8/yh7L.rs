fn main() {
    // Hello world!
    println!("Hello, world!");
    variables_and_mutability();
    
}

fn variables_and_mutability() {
    // Variables and Mutability
    println!("\n--Variables and Mutability--\n");

    // Mutability
    println!("Mutability");
    let x = 5; // This makes an immutable variable named x
    println!("The value of x is {x}");
    //x = 6; // This will not work, as x is immutable 
    println!("The value of x is {x}");

    let mut y = 5; // This makes a mutable variable named y
    println!("The value of y is {y}");
    y = 6; // This will work, as y is mutable 
    println!("The value of y is {y}");

    // Constants
    println!("\nConstants");
    

}
