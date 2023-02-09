Feature: Edit a Role Feature
Scenario: Edit a Role Feature
        Given Im logged in to the site and i navigate to Roles
        When I create new Role
        When I navigate to a created role and change name and description and click on save
        Then I will see that the role has been edited