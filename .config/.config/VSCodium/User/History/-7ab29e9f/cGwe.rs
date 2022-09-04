fn main() {
    // Intro
    println!("Common Programming Concepts\n");
    variables_and_mutability();
    data_types();
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

fn data_types() {
    // Scalar types represents a single value. Integers, floats, booleans, characters
    let x = 2.0; // f64 is implicit
    let y: f32 = 3.0; // f32 is explicit
    println!("{x}{y}");

    // Numeric Operations
    // add
    let sum = 5 + 10;
    // subtract
    let difference = 99.5 - 4.3;
    // multiply
    let product = 4 * 30;
    // division
    let quotient = 56.7 / 32.2;
    let floored = 2 / 3; // results in 0
    // remainder
    let remainder = 43 % 5;
    
    println!("{sum} {difference} {product} {quotient} {floored} {remainder}");

    // boolean
    let t = true;
    let f: bool = false; // explicit type annotation
    println!("{t} {f}");

    // character
    let c = 'z';
    let z: char = 'Z'; // explicit type annotation
    let heart_eyed_cat = '😻';
    println!("{c} {z} {heart_eyed_cat}");

    // Compund types
    // tuple
    // let tup : (i32, f64, u8) = (500, 6.4, 1); // explicit annotation
    let tup2 = (500, 6.4, 1);
    let (x, y, z) = tup2;
    println!("The value of x, y, z is {x} {y} {z}");

    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;
    println!("{five_hundred} {six_point_four} {one}");

    // Arrays
    let a = [1, 2, 3, 4, 5]; // Array types are better when you know how many elements there will be
    let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let a: [i32; 5] = [1, 2, 3, 4, 5]; // i32 determines the type, 5 is the number if items in the list


}