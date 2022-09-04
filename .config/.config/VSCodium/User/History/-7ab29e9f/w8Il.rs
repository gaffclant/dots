fn main() {
    // Intro
    println!("Common Programming Concepts\n");
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
    const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3; // Makes a constant
    println!("The constant is {THREE_HOURS_IN_SECONDS}");

    // Shadowing
    println!("\nShadowing");
    let z = 5; // Makes an immutable variable named z
    let z = z + 1; // Makes an immutable variable named z that is 1 greater than the previous z variable
    { // Makes an inner scope
        let z = z * 2; // Creates a z variable in the inner scope using the z variable times 2
        println!("The value of z in the inner scope is {z}");
    }
    println!("The value of z is {z}");

    let spaces = "   "; // Create a variable made up of 3 spaces (String type)
    let spaces = spaces.len(); // Make a variable called spaces set to the lengh of spaces (Number type)

    //let mut spaces = "   "; // Create a mutable spaces variable
    //spaces = spaces.len(); // This will not work, as spaces is already a number type 
    println!("Spaces is {spaces}");

}
