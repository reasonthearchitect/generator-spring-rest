package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import com.fasterxml.jackson.databind.ObjectMapper;

import <%=packageName%>.dto.<%= sinkDtoClass %>;
import <%=packageName%>.dto.<%= sourceDtoClass %>;

@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>Processor {

	@Autowired
    ObjectMapper mapper;

	@StreamListener("<%= sinkName %>")
  	@SendTo("<%=  sourceName %>")
  	public Message<?> handle(<%= sinkDtoClass %> <%= sinkDtoInstance %>) {

  		<%= sourceDtoClass %> <%= sourceDtoInstance %> = new <%= sourceDtoClass %>();

  		try {
	  		return MessageBuilder.withPayload(
	                    mapper.writeValueAsString(<%= sourceDtoInstance %>)
	            )
	            .setHeader("contentType", "application/json")
	            .build();
	    } catch (Exception e) { throw new RuntimeException(e);}
  	}
}