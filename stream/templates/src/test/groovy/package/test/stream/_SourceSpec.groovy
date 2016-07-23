package <%=packageName%>.test.stream

import <%=packageName%>.dto.<%= sourceDtoClass %>
import <%=packageName%>.stream.<%= entityClass %>Source

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.messaging.MessageChannel
import spock.lang.Specification

class <%= entityClass %>SourceSpec extends Specification {

    <%= entityClass %>Source <%= entityInstance %>Source;

    def setup() {
        this.<%= entityInstance %>Source           = new <%= entityClass %>Source();
        this.<%= entityInstance %>Source.mapper    = new ObjectMapper();
        this.<%= entityInstance %>Source.post      = Mock(MessageChannel);
    }

    def "simple test for teh source"() {

        when:
        this.<%= entityInstance %>Source.send([] as <%= sourceDtoClass %>);

        then:
        1 * this.<%= entityInstance %>Source.post.send(_)
    }
}
