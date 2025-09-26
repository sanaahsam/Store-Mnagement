
## Raw Store Management System


# 📌 Description

**This project is a simple Inventory Management System that allows users to:**

-Create and Edit item details with validations.
-Record Inward (Received Items) into stock.
-Record Outward (Issued Items) from stock with availability checks.
-Generate Reports of items showing Item ID, Item Name, Quantity, and Unit of Measurement (UoM).
-Easily Navigate through items in the database using built-in navigation buttons (First, Last, Next, Previous).
The project demonstrates how to manage stock transactions with proper validation and provides reporting features for easy monitoring.



## ⚡ Features

**Item Management Page**: Add new items or edit existing ones.

**Inward Page**: Record received materials, validate existing Item IDs.

**Outward Page**: Record issued materials, validate stock availability.

**Report Page**: Display Item ID, Item Name, Quantity, and UoM in a tabular format.

**Navigation Controls**: Quickly move through records with First, Last, Next, and Previous buttons.

**Validations**: Prevents invalid Item IDs, over-issuing of stock, and ensures mandatory fields are entered.



# 🎯 Validations

**Item Management**: Checks if Item ID exists before adding.

**Inward (Received)**: Item must exist; otherwise error “Item not present”.

**Outward (Issued)**: Quantity cannot exceed available stock; otherwise error “Quantity entered is more than available”.

**Report**: Always shows live current stock (Opening + Received − Issued).

**Navigation**: Ensures smooth browsing of records without manual searching.


# illustration 
