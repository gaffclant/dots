fn main() {
    // Hello world!
    println!("Hello, world!");
    mutable_vars();
    
}

fn mutable_vars() {
    // Variables and Mutability
    let x = 5; // This makes an immutable variable
    println!("The value of x is {x}");
    //x = 6; // This will not work, as x is immutable 
    println!("The value of x is {x}");

    let mut y = 5; // This makes a mutable variable
    println!("The value of y is {y}");
    y = 6; // This will work, as y is mutable 
    println!("The value of y is {y}");
}
