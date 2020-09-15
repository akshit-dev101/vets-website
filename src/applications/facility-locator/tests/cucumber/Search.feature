Feature: Search functionality

  Scenario: Veteran arrives on https://www.va.gov/find-locations
    Given I am on the facility locator
    Then the Facility type field displays the default "Choose a facility type"
    And the Facility type drop down contains VA and Community care options
    And location information must be entered or enabled through browser before search can be initiated
    And facility type must be selected before search can be initiated
