package <%=packageName%>.test.stream


import <%=packageName%>.dto.<%= sinkDtoClass %>
import <%=packageName%>.stream.<%= entityClass %>Sink

import com.fasterxml.jackson.databind.ObjectMapper
import spock.lang.Specification

class <%= entityClass %>SinkSpec extends Specification {

    <%= entityClass %>Sink <%= entityInstance %>Sink;

    def setup() {
        this.<%= entityInstance %>Sink           = new <%= entityClass %>Sink();
        this.<%= entityInstance %>Sink.mapper    = new ObjectMapper();
    }

    def "simple sink test" () {

        when:
        this.<%= entityInstance %>Sink.sink( [] as <%= sinkDtoClass %> )

        then:
        1 == 1
    }
}
