# GitHub Readme for Book Management App


## Introduction

This repository contains the documentation for the Book Management App developed by SoftUni.
The Book Management App allows users to view, edit, and delete books. Additionally, users can like books added by other users.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Viewing Books](#viewing-books)
3. [Viewing Book Details](#viewing-book-details)
4. [Editing Books](#editing-books)
5. [Deleting Books](#deleting-books)
6. [Viewing User's Own Books](#viewing-users-own-books)
7. [Liking Books](#liking-books)

## Getting Started

The Book Management App is a web service that provides endpoints for various book-related actions. The app uses the RESTful API approach, and the available methods are GET, POST, PUT, and DELETE. Users need to be logged in to perform certain actions, such as editing or deleting books.

## Viewing Books

To view the list of all available books, send a GET request to the following URL:


Method: GET
URL: /data/books?sortBy=_createdOn%20desc


This will return an array of book objects, each containing details such as title, description, imageUrl, and type.
Viewing Book Details

To view details about a specific book, send a GET request to the following URL, replacing :id with the desired book's ID:


Method: GET
URL: /data/books/:id

If the currently logged-in user is the creator of the book, the [Edit] and [Delete] buttons will be displayed on the Details page. Otherwise, these options will not be available.
Editing Books

Logged-in users can edit their own books. To edit a book, click on the [Edit] link on the Details page. This will display the Edit page with input fields for the book's properties. All fields must be filled before sending the request.

To edit a book, use the following request:


Method: PUT
URL: /data/books/:id

The :id parameter should be replaced with the ID of the book you want to edit. The request body should have the following shape:

json

{
  "title": "New Title",
  "description": "New Description",
  "imageUrl": "https://example.com/new-image.jpg",
  "type": "New Type"
}

Upon success, the app will redirect the user to the Details page for the updated book.
Deleting Books

Logged-in users can delete their own books. To delete a book, click on the [Delete] action on the Details page. A confirmation dialog will be displayed, and upon confirming, the book will be deleted from the system, and the user will be redirected to the All Books/Dashboard page.

To delete a book, use the following request:


Method: DELETE
URL: /data/books/:id

Replace :id with the ID of the book you want to delete. Upon success, the app will redirect the user to the All Books/Dashboard page.
Viewing User's Own Books

Each logged-in user can view their own books by clicking on [My Books]. This will list all the books added by the current user.

If there are no books, the following view will be displayed:

My Books Empty View

To view the list of books added by the current user, use the following request:


Method: GET
URL: /data/books?where=_ownerId%3D%22{userId}%22&sortBy=_createdOn%20desc

Replace {userId} with the ID of the currently logged-in user. The service will return an array of books created by that user.
Liking Books

Every logged-in user, except the creators, can like other books. To like a book, click on the [Like] button, and the counter for that book will increase by 1.

The view when the user has not liked the book yet looks like:

Like Book

When the user likes the book, the [Like] button will not be available, and the counter will increase by 1.

Creators are not able to see the [Like] button, and the view looks like:

Creator View

Guests are not able to see the [Like] button, and the view for guests looks like:

Guest View

To add a like to a book, use the following request:


Method: POST
URL: /data/likes

The request body should have the following shape:

json

{
  "bookId": "bookId_here"
}

The service will return the newly created record.

To get the total likes count for a book, use the following request:


Method: GET
URL: /data/likes?where=bookId%3D%22{bookId}%22&distinct=_ownerId&count

Replace {bookId} with the ID of the desired book. The service will return the total likes count.

To check if a user has liked a specific book, use the following request:


Method: GET
URL: /data/likes?where=bookId%3D%22{bookId}%22%20and%20_ownerId%3D%22{userId}%22&count

Replace {bookId} with the ID of the desired book and {userId} with the ID of the currently logged-in user. The service will return either 0 or 1, depending on whether the user has liked the book or not.

arduino


Please note that the images mentioned in the Markdown content (`https://example.com/...`) are placeholders and should be replaced with actual image URLs.
