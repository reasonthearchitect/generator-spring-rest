package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.SendTo;

import <%=packageName%>.dto.<%= sinkDtoClass %>Dto;
import <%=packageName%>.dto.<%= sourceDtoClass %>Dto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.java.Log;

@Log
@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>Processor {

	@StreamListener("<%= sinkName %>")
  	@SendTo("<%=  sourceName %>")
  	public <%= sourceDtoClass %>Dto handle(<%= sinkDtoClass %>Dto <%= sinkDtoInstance %>Dto) {
    	return new <%= sourceDtoClass %>Dto();
  	}
}