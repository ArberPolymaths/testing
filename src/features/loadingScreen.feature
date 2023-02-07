Feature: Stuck on loading screen

Scenario: Stuck on loading screen
        Given I am in browser
        When I go to ims site and i reload the page a few times
        Then The page will not get stuck in loading screen