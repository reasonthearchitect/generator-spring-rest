package <%=packageName%>.test.stream

import <%=packageName%>.dto.<%= sinkDtoClass %>;
import <%=packageName%>.dto.<%= sourceDtoClass %>;
import <%=packageName%>.stream.<%= entityClass %>Processor

import org.springframework.messaging.Message
import com.fasterxml.jackson.databind.ObjectMapper
import spock.lang.Specification

class <%= entityClass %>ProcessorSpec extends Specification {

    <%= entityClass %>Processor <%= entityInstance %>Processor;

    def setup() {
        this.<%= entityInstance %>Processor         = new <%= entityClass %>Processor();
        this.<%= entityInstance %>Processor.mapper  = new ObjectMapper();
    }

    def "simple test to make sure that the right object is returned"() {

        setup:
        <%= sinkDtoClass %> <%= sinkDtoInstance %> = [];

        when:
        Message message = this.<%= entityInstance %>Processor.handle(<%= sinkDtoInstance %>);

        then:
        message != null
        message.getPayload() != null
    }
}
