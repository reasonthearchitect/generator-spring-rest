package <%=packageName%>.jbehave.facade

import <%=packageName%>.jbehave.AbstractSpringJBehaveStory
import <%=packageName%>.jbehave.Steps
import org.jbehave.core.annotations.Given
import org.jbehave.core.annotations.Then
import org.jbehave.core.annotations.When

@Steps
class ExampleOfHowToBehave extends AbstractSpringJBehaveStory {

    @Given("I am a generator")
    def "I am a generator"() {
        println("GIVEN GENERATING");
    }

    @When("I generate")
    def "I generate"() {
        println("WHEN GENERATING");
    }

    @Then("I can pass a basic JBehave story")
    def "I can pass a basic JBehave story"() {
        println("THEN GENERATING");
    }
}
