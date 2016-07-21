package <%=packageName%>.stream;
<% if (channelType == 'sink' || channelType == 'processor') { %>
import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;<% } %><% if (channelType == 'source' || channelType == 'processor') { %>
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;<% } %>
import org.springframework.stereotype.Component;

@Component
public interface <%= entityClass %>Metadata {
	<% if (channelType == 'sink' || channelType == 'processor') { %>
		@Input("<%= sinkName %>")
    	SubscribableChannel read();
	<% } %> <% if (channelType == 'source' || channelType == 'processor') { %>
		@Output("<%= sourceName %>")
    	MessageChannel post();<% } %>
}