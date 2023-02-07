Feature: Sign Out Feature

Scenario: Sign Out Feature
        Given Im authenticated in the IMS site
        When I click the log out button
        Then I will see the authentication page