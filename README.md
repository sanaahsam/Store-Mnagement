
## Raw Store Management System


# 📌 Description

**This project is a simple Inventory Management System that allows users to:**

-Create and Edit item details with validations.
-Record Inward (Received Items) into stock.
-Record Outward (Issued Items) from stock with availability checks.
-Generate Reports of items showing Item ID, Item Name, Quantity, and Unit of Measurement (UoM).
-Easily Navigate through items in the database using built-in navigation buttons (First, Last, Next, Previous).
The project demonstrates how to manage stock transactions with proper validation and provides reporting features for easy monitoring.



## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript  
- **Styling**: Bootstrap 5  
- **Database & API**: JsonPowerDB (Login2Explore)  



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



## 🌟 Benefits of Using JsonPowerDB

- 🚀 **Fast & Lightweight**: Ideal for real-time applications with instant data updates.  
- 🔒 **Secure**: Offers built-in security mechanisms and key-based access.  
- 📡 **API-First**: Easy-to-use RESTful APIs without requiring server-side code.  
- 💡 **Simple Setup**: No backend configuration or deployment needed.  
- 💾 **In-Browser DB**: CRUD operations directly via API calls from the frontend.



# illustration 

<img width="1898" height="874" alt="home" src="https://github.com/user-attachments/assets/e1851053-b55b-4276-8f90-eb34a6280028" />


<img width="1892" height="869" alt="home2" src="https://github.com/user-attachments/assets/acaa373f-226d-47ad-9de9-4c55570ce3b2" />


<img width="1898" height="877" alt="inward" src="https://github.com/user-attachments/assets/864607df-d0e1-49ed-8f75-9cd161e5db68" />


<img width="1899" height="877" alt="outward" src="https://github.com/user-attachments/assets/34efb136-e146-4159-bf02-49a104501772" />


<img width="1890" height="871" alt="report" src="https://github.com/user-attachments/assets/80dd47ee-704e-4c20-81b5-028bc3b069c8" />
