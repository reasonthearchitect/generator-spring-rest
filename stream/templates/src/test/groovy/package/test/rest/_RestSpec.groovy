package <%=packageName%>.test.rest

import <%=packageName%>.dto.<%= sourceDtoClass %>
import <%=packageName%>.rest.<%= entityClass %>Rest
import <%=packageName%>.stream.<%= entityClass %>Source

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import spock.lang.Specification


class <%= entityClass %>RestSpec extends Specification {

    <%= entityClass %>Rest <%= entityInstance %>Rest;

    def setup() {
        this.<%= entityInstance %>Rest        = new <%= entityClass %>Rest();
        this.<%= entityInstance %>Rest.source = Mock(<%= entityClass %>Source);
    }

    def "simple test for the rest endpoint"() {

        when:
        ResponseEntity responseEntity = this.<%= entityInstance %>Rest.process([] as <%= sourceDtoClass %>);

        then:
        1 * this.<%= entityInstance %>Rest.source.send(_);
        responseEntity != null;
        responseEntity.getStatusCode() == HttpStatus.CREATED;
    }
}
