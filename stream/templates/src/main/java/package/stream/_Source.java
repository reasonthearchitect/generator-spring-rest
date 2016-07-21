package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Component;

import <%=packageName%>.dto.<%= entityClass %>Dto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.java.Log;

@Log
@Component
@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>Source {

        @Autowired @Qualifier("<%=  sourceName %>")
        private MessageChannel post<%= entityClass %>;

        @Autowired
        ObjectMapper mapper;

        public void send<%= entityClass %>(<%= entityClass %>Dto <%= entityInstance %>Dto) {
                try {
                        Message<?> message = MessageBuilder.withPayload(
                                        mapper.writerWithDefaultPrettyPrinter().writeValueAsString(<%= entityInstance %>Dto)
                                )
                                .setHeader("content-type", "application/json")
                                .build();
                        post<%= entityClass %>.send(message);
                } catch (Exception ex) {
                        log.error("Error trying to send a message to a queue: ", ex);
                }        
        }

}
