Feature: This is a feature created for an assessment

    #@assessment
    Scenario: Q1 Broken Links Detection Automation
        Given Launch the "https://practicetestautomation.com/practice-test-login/" website
        When Get list of all links in the screen
        Then Naviage to each of the valid links and verify the links under each page are not broken

    @assessment
    Scenario: Q2 API Automation for User Registration and Support Case Creation
        Given Create a new user "<UserName>" and password "<Password>" using register endpoint
        Then Verify the user "<UserName>" and password "<Password>" is able to login using login endpoint
        When Create a support ticket using tickets endpoint with "Demo Support Ticket" title and "This is a support ticket created for demo" description
        Then Verify the ticket id generated is available in tickets endpoint

        Examples:
            | UserName         | Password |
            | demo42@gmail.com | 1234     |