Feature: Pagination format

Scenario: Pagination format
        Given I am in a browser that has more than 250 rows
        When I add one more row to the table
        Then The pagination format will not change