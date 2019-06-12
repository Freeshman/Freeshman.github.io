# Linux下配置WEB服务器

## 1.简介
目前WEB服务器有Apache和Nginx两种，两种WEB服务器都是用于处理静态HTML的请求。为了处理动态的PHP文件，首先下载好PHP服务器，然后需要分别对两个WEB服务器进行设置：

Apache需要下载libapache-mod-php
Nginx需要在配置文件中将对PHP文件的访问转发给CGI服务器
下面分别对两种服务器及其对PHP的支持配置过程进行描述。


## 2. Apache

### 2.1 安装Apache服务器
使用```sudo apt-get install apache[x]```命令下载Apache服务器，[x]是可能的Apacha版本号。

下载完成之后，访问localhost，出现Apache的默认主页，apache服务器安装便完成了。此时还不支持PHP，访问.php的文件时，会直接显示源码。


### 2.2 Apache服务器PHP的支持
为了让Apache支持PHP，只需再下载apache-php-mod，然后重启Apache服务即可。

Apache服务器的安装、配置比较简单。


## 3.Nginx
### 3.1 Nginx服务器的安装
输入```sudo apt-get install nginx```命令下载nginx服务器。下载完成后，同样访问localhost，出现Nginx的默认主页。此时Ngingx暂时还不支持PHP，访问PHP文件会直接下载下来。
### 3.2 Nginx服务器PHP转发配置
在Nginx的默认配置文件```/etc/nginx/sites-enabled/default```中，Nginx默认包含有PHP转发相关的配置信息，但是是被注释掉的。需要根据系统的实际情况将注释去掉，关键的是fastcgi_pass这一行，后面的内容需要根据PHP-FPM监听的地址进行修改。
PHP-FPM所监听的地址可以在```/etc/php5/fpm/pool.d/www.conf```文件中的```listen = XXXXXXX```确定。

为了给大家参考，下面贴出配置完成后的配置选项，文章的情况是PHP-FPM监听127.0.0.1:9000：
```
location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        #       # With php5-cgi alone:
                fastcgi_pass 127.0.0.1:9000;
        #       # With php5-fpm:
        #       fastcgi_pass unix:/var/run/php5-fpm.sock;
        }
 ```
修改完成后，```nginx -t```命令测试配置文件是否正确。确认配置文件正确以后，```sudo service nginx restart```重启nginx服务器即可。
## **提示**：

Nginx的配置选项不要去复制网上的，直接修改默认的即可。
如果上述操作完成之后，仍然不能正常访问PHP页面，仔细检查，确保自己的配置已经生效
